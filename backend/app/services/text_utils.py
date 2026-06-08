import json
from collections.abc import Iterable
from typing import Any


def to_plain_text(value: Any) -> str:
    if value is None:
        return ""

    if isinstance(value, str):
        return value

    if isinstance(value, dict):
        if "content" in value:
            return to_plain_text(value.get("content"))
        if "text" in value:
            return to_plain_text(value.get("text"))
        if "source" in value and len(value) == 1:
            return to_plain_text(value.get("source"))
        return json.dumps(value, ensure_ascii=False)

    if isinstance(value, list | tuple | set):
        return safe_join(value)

    return str(value)


def safe_join(items: Any, separator: str = "\n") -> str:
    if items is None:
        return ""

    if isinstance(items, str):
        return items

    if isinstance(items, dict):
        return to_plain_text(items)

    if not isinstance(items, Iterable):
        return to_plain_text(items)

    return separator.join(to_plain_text(item) for item in items)


def first_item_type(value: Any) -> str:
    if isinstance(value, dict):
        for item in value.values():
            if isinstance(item, list) and item:
                return type(item[0]).__name__
        return "empty-dict" if not value else "dict"

    if isinstance(value, list | tuple | set):
        sequence = list(value)
        return type(sequence[0]).__name__ if sequence else "empty-list"

    return type(value).__name__
