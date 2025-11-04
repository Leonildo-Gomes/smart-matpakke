import { FastifyReply, FastifyRequest } from 'fastify';

import { FamilyInput } from './family.schema';
import { createFamilyService, deleteFamilyService, getAllFamiliesService, getFamilyService, updateFamilyService } from './family.service';




export async function create(request: FastifyRequest, reply:FastifyReply) {
    try {
        const family = await createFamilyService(request.body as FamilyInput)
        return reply.status(201).send(family);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}

export async function getAll(request: FastifyRequest, reply:FastifyReply ){
    try {
        const families= await getAllFamiliesService();
        return reply.status(200).send(families);

    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });
        
    }
}

export async function getById(request: FastifyRequest, reply:FastifyReply) {
    try {
        const familyId = (request.params as Record<string, string>).id as string;
        if (!familyId) {
            return reply.status(400).send({ message: 'Family ID is required' });
        }
        const family = await getFamilyService(familyId);
        return reply.status(200).send(family);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}

export async function remove(request: FastifyRequest, reply:FastifyReply) {
    try {
        const familyId = (request.params as Record<string, string>).id as string;
        if (!familyId) {
            return reply.status(400).send({ message: 'Family ID is required' });
        }
        const family = await deleteFamilyService(familyId);
        return reply.status(200).send(family);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}


export async function update(request: FastifyRequest, reply:FastifyReply) {
    try {
        const familyId = (request.params as Record<string, string>).id as string;
        if (!familyId) {
            return reply.status(400).send({ message: 'Family ID is required' });
        }
        const family = await updateFamilyService(familyId, request.body as FamilyInput)
        return reply.status(200).send(family);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}