from app.rag.vector_store import initialize_vector_store
from app.services.text_utils import to_plain_text


def retrieve_relevant_context(query: str, top_k: int = 5) -> list[dict]:
    collection = initialize_vector_store()
    query_text = to_plain_text(query)
    results = collection.query(query_texts=[query_text], n_results=top_k)

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    return [
        {
            "content": to_plain_text(document),
            "metadata": metadata if isinstance(metadata, dict) else {},
            "distance": float(distance) if distance is not None else None,
        }
        for document, metadata, distance in zip(documents, metadatas, distances)
    ]
