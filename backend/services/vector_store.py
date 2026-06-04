from math import sqrt
import re
from uuid import uuid4

from backend.schemas.ai import VectorDocument, VectorDocumentInput
from backend.schemas.website import RagContextItem
from backend.services.rag_knowledge import KNOWLEDGE_BASE


VECTOR_DIMENSIONS = 48


def _tokens(value: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", value.lower())


def _embed_text(value: str) -> list[float]:
    vector = [0.0] * VECTOR_DIMENSIONS

    for token in _tokens(value):
        vector[hash(token) % VECTOR_DIMENSIONS] += 1.0

    magnitude = sqrt(sum(component * component for component in vector))

    if magnitude == 0:
        return vector

    return [round(component / magnitude, 6) for component in vector]


def _cosine_similarity(left: list[float], right: list[float]) -> float:
    return sum(left_value * right_value for left_value, right_value in zip(left, right))


class VectorStoreService:
    def __init__(self) -> None:
        self._documents: dict[str, VectorDocument] = {}
        self._seed_documents()

    def list_documents(self) -> list[VectorDocument]:
        return sorted(self._documents.values(), key=lambda document: document.title)

    def upsert_document(self, payload: VectorDocumentInput) -> VectorDocument:
        document_id = payload.id or f"doc-{uuid4().hex[:10]}"
        document = VectorDocument(
            id=document_id,
            title=payload.title,
            category=payload.category,
            content=payload.content,
            metadata=payload.metadata,
            embedding=_embed_text(
                f"{payload.title} {payload.category} {payload.content}"
            ),
        )
        self._documents[document_id] = document

        return document

    def search(
        self, query: str, top_k: int = 5, categories: list[str] | None = None
    ) -> list[RagContextItem]:
        query_embedding = _embed_text(query)
        category_filter = set(categories or [])
        scored_documents = []

        for document in self._documents.values():
            if category_filter and document.category not in category_filter:
                continue

            score = _cosine_similarity(query_embedding, document.embedding)

            if score > 0:
                scored_documents.append((score, document))

        return [
            RagContextItem(
                id=document.id,
                title=document.title,
                category=document.category,
                content=document.content,
                score=max(1, round(score * 100)),
            )
            for score, document in sorted(
                scored_documents,
                key=lambda item: (item[0], item[1].title),
                reverse=True,
            )[:top_k]
        ]

    def _seed_documents(self) -> None:
        for document in KNOWLEDGE_BASE:
            self.upsert_document(
                VectorDocumentInput(
                    id=document.id,
                    title=document.title,
                    category=document.category,
                    content=document.content,
                    metadata={"seeded": True, "keywords": list(document.keywords)},
                )
            )


vector_store = VectorStoreService()
