import { PromptTemplate } from '@langchain/core/prompts';
import type { GraphState } from '../state.ts';
import { prompts } from '../../config.ts';
import { AIMessage } from 'langchain';

export async function blockedNode(state: GraphState): Promise<Partial<GraphState>> {
  const guardRailCheck = state.guardrailCheck!
  const analysis = guardRailCheck.analysis
    ? `**Análise:** ${guardRailCheck.analysis}`
    : ''

  const permissions = state.user.permissions?.join(', ') ?? 'Nenhuma'
  const template = PromptTemplate.fromTemplate(prompts.blocked)
  const blockedMessage = await template.format({
    REASON: guardRailCheck.reason ?? 'A verificação de segurança falhou',
    ANALYSIS: analysis,
    USER_ROLE: state.user.role,
    PERMISSIONS: permissions
  })

  return {
    messages: [new AIMessage(blockedMessage)]
  };
}
