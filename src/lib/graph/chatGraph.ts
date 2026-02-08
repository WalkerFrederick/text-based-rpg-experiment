import { ChatOpenAI } from '@langchain/openai'
import { StateGraph, END, START } from '@langchain/langgraph'
import { BaseMessage, SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages'
import { Annotation } from '@langchain/langgraph'
import type { ChatMetadata } from './state'

// Define the graph state using Annotation
const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (_, y) => y,
    default: () => [],
  }),
  context: Annotation<string>({
    reducer: (_, y) => y,
    default: () => '',
  }),
  systemPrompt: Annotation<string>({
    reducer: (_, y) => y,
    default: () => '',
  }),
  response: Annotation<string | null>({
    reducer: (_, y) => y,
    default: () => null,
  }),
  metadata: Annotation<ChatMetadata | null>({
    reducer: (_, y) => y,
    default: () => null,
  }),
  isAboveTable: Annotation<boolean>({
    reducer: (_, y) => y,
    default: () => false,
  }),
})

type GraphStateType = typeof GraphState.State

// Initialize the LLM
const llm = new ChatOpenAI({
  modelName: 'gpt-4.1',
  temperature: 0.8,
})

// Node: Build the prompt with system message and context
async function buildPrompt(state: GraphStateType): Promise<Partial<GraphStateType>> {
  // Use the pre-built system prompt from the API route
  const systemMessage = new SystemMessage(state.systemPrompt)
  
  // Prepend system message to the conversation
  const messagesWithSystem = [systemMessage, ...state.messages]
  
  return {
    messages: messagesWithSystem,
  }
}

// Node: Call the LLM
async function callLLM(state: GraphStateType): Promise<Partial<GraphStateType>> {
  const startTime = Date.now()
  
  const response = await llm.invoke(state.messages)
  
  const latencyMs = Date.now() - startTime
  
  // Extract token usage if available
  const usage = response.usage_metadata
  
  return {
    response: typeof response.content === 'string' ? response.content : JSON.stringify(response.content),
    metadata: {
      model: 'gpt-4.1',
      inputTokens: usage?.input_tokens ?? 0,
      outputTokens: usage?.output_tokens ?? 0,
      latencyMs,
    },
  }
}

// Node: Format the response (passthrough for now, but can add post-processing)
async function formatResponse(state: GraphStateType): Promise<Partial<GraphStateType>> {
  // Currently a passthrough - could add response formatting/validation here
  return {
    response: state.response,
    metadata: state.metadata,
  }
}

// Build the graph
const workflow = new StateGraph(GraphState)
  .addNode('buildPrompt', buildPrompt)
  .addNode('callLLM', callLLM)
  .addNode('formatResponse', formatResponse)
  .addEdge(START, 'buildPrompt')
  .addEdge('buildPrompt', 'callLLM')
  .addEdge('callLLM', 'formatResponse')
  .addEdge('formatResponse', END)

// Compile the graph
export const chatGraph = workflow.compile()

// Helper to convert simple message format to LangChain messages
export function toLangChainMessages(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): BaseMessage[] {
  return messages.map((msg) => {
    switch (msg.role) {
      case 'user':
        return new HumanMessage(msg.content)
      case 'assistant':
        return new AIMessage(msg.content)
      case 'system':
        return new SystemMessage(msg.content)
      default:
        return new HumanMessage(msg.content)
    }
  })
}
