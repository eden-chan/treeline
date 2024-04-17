
from typing import List
from pydantic import BaseModel, Field, conlist, Field, BeforeValidator
from enum import Enum, auto
from typing_extensions import Annotated
from enum import Enum
import instructor
# Define data models using Pydantic for type validation and settings
class User(BaseModel):
    name: str
    age: int


class FactDescriptor(BaseModel):
    fact: str = Field(description="Provide information directly relevant to the question (or where to find more information in the text) - either supplementary data, facts, or where the answer might be located, like pages and sections. Add definitions and other context from the page into the fact, so it's self-explanatory")
    relevance: str = Field(description="How is this fact relevant to the answer?")
    nextSource: str = Field(description="Based the provided metadata, provide the section name, or other descriptors of where to look for more information.")
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
    fact_descriptors : List[FactDescriptor]=  Field()


class RankedTitle(BaseModel):
    reasoning: str = Field(description='Is this candidate text the title of the paper?  Is it concise (around 10-15 words), informative, and reflective of the paper\'s content?')
    confidence: float = Field(
        ge=0,
        le=1,
        description="The confidence of the candidate being the title based on the reasoning, 0 is low, 1 is high",
    )
    candidate: str = Field(description='The original text of the candidate title')

class TitleRanker(BaseModel):
    ranked_candidates: List[RankedTitle]
    answer: Annotated[
        str,
        BeforeValidator(
            instructor.llm_validator("ensure titles don't contain objectionable content", allow_override=True)
        ),
    ]
    
class RankedAbstract(BaseModel):
    reasoning: str = Field(description='Is this candidate text the research paper abstract? Is it prefaced by ABSTRACT? Does it briefly summarize the paper\'s purpose, research problem, methodology, major findings, conclusions, and implications?')
    confidence: float = Field(
        ge=0,
        le=1,
        description="The confidence of the candidate being the abstract based on the reasoning, 0 is low, 1 is high",
    )
    candidate: str = Field(description='The candidate abstract')

class AbstractRanker(BaseModel):
    ranked_candidates: List[RankedAbstract]
    answer: Annotated[
        str,
        BeforeValidator(
            instructor.llm_validator("ensure abstracts don't contain objectionable content", allow_override=True)
        ),
    ]

class EMBEDDING_TYPE(Enum):
    FactDescriptor = "FactDescriptor"
    SourceText = "SourceText"
class ClientType(Enum):
    ANTHROPIC = auto()
    OPENAI = auto()