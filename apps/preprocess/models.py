
from typing import List
from pydantic import BaseModel, Field, conlist
from enum import Enum, auto

# Define data models using Pydantic for type validation and settings
class User(BaseModel):
    name: str
    age: int


class FactDescriptor(BaseModel):
    fact: str = Field(description="Provide information directly relevant to the question (or where to find more information in the text) - either supplementary data, facts, or where the answer might be located, like pages and sections. Add definitions and other context from the page into the fact, so it's self-explanatory")
    relevance: str = Field(description="How is this fact relevant to the answer?")
    nextSource: str = Field(description="a page number, a section name, or other descriptors of where to look for more information.")
    expectedInfo: str = Field(description="What information do you expect to find there?")

    class Config:
        json_schema_extra = {
            "example": {
                "fact": "The concept of attention mechanisms in neural networks allows models to focus on specific parts of the input for making decisions.",
                "relevance": "Explains the core concept behind the paper's methodology.",
                "nextSource": "Section 3.1",
                "expectedInfo": "Detailed explanation of the attention mechanism used in the model."
            }
        }

class ExtractFactDescriptor(BaseModel):
    fact_descriptors : List[FactDescriptor]=  Field(min_length=1, max_length=7)



class ClientType(Enum):
    ANTHROPIC = auto()
    OPENAI = auto()