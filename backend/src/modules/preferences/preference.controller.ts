
import { FastifyReply, FastifyRequest } from "fastify";
import { PreferenceInput } from "./preference.schema";
import { createPreferenceService, getAllPreferencesService, getPreferenceByIdService, updatePreferenceService } from "./preference.service";


export async function getAll(request: FastifyRequest, reply:FastifyReply) {
    try {
        const preferences = await getAllPreferencesService();
        return reply.status(200).send(preferences);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });
    }
    
}

export async function getById(request: FastifyRequest, reply:FastifyReply) {
    try {
        const preferenceId = (request.params as Record<string, string>).id as string;
        if (!preferenceId) {
            return reply.status(400).send({ message: 'Preference ID is required' });
        }
        const preference = await getPreferenceByIdService(preferenceId);
        return reply.status(200).send(preference);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}
export async function create(request: FastifyRequest, reply:FastifyReply) {
    try {
        
        const preference = await createPreferenceService(request.body as PreferenceInput)
        return reply.status(201).send(preference);
    } catch (error) {
       
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}


export async function update(request: FastifyRequest, reply:FastifyReply) {
    try {
         const preferenceId = (request.params as Record<string, string>).id as string;
        if (!preferenceId) {
            return reply.status(400).send({ message: 'Preference ID is required' });
        }
      
        const preference = await updatePreferenceService(preferenceId, request.body as PreferenceInput)
        return reply.status(200).send(preference);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}