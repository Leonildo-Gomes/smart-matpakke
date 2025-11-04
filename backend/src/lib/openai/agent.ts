import * as fs from 'fs';
import OpenAI from "openai";
import { buildDocsSystemPrompt, buildSystemPrompt, buildUserPrompt } from "../../modules/plans/generate/plan.prompts";
import { PlanGenerationContext } from "../../modules/plans/generate/plan.types";
import { CustomError } from '../errors/custom.errors';
const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
    timeout: 5*60*1000,
    logLevel: 'debug'
}) 


export async function generateText( planGenerationContext: PlanGenerationContext) {
    const matpakkeGuidelines=fs.readFileSync('knowledge/matpakke_guidelines.md', 'utf-8');
    const stream =  await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: buildSystemPrompt()},
            {role: "system", content: buildDocsSystemPrompt(matpakkeGuidelines)},
            {role: "user", content: buildUserPrompt(planGenerationContext)},
        ],
        temperature: 0.6,
        stream: true
    });

    let message = '';
    for await (const chunk of stream) {
        message += chunk.choices[0]?.delta?.content || '';
    }

   
    if (!message) {
        throw new CustomError('No message returned from OpenAI', 500);
    }
    return message;
    
    
}

