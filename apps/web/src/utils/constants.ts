export const FOLLOW_UP_PROMPT = `
Write three follow up questions and nothing else. Seperate each of the questions with a question mark.
For example:

[Original Text]:
Machine learning transformers work by taking input data, often in the form of sequences like text, and processing it through layers of self-attention mechanisms. This self-attention allows the model to weigh the importance of different parts of the input differently, enabling it to capture complex patterns and relationships within the data. Finally, the transformers output the processed information, which can be used for various tasks such as translation, text generation, or classification, by understanding both the context and the specific details of the input.

[Follow Up Questions]: 
How do transformers differ from previous machine learning models in handling context in natural language processing tasks?
What are some specific applications or tasks where transformers have significantly outperformed traditional models?
Can you explain the role and mechanism of positional encoding in transformers and its importance in processing sequential data?
`;
