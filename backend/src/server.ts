import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import Fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { loginRoutes } from './modules/auth/login/login.routes';
import { authRoutes } from './modules/auth/register/register.routes';
import { familyRoutes } from './modules/families/family.routes';
import { ingredientRoutes } from './modules/ingredients/ingredient.routes';
import { nutrientRoutes } from './modules/nutrients/nutrient.routes';
import { planRoutes } from './modules/plans/generate/plan.routes';
import { preferenceRoutes } from './modules/preferences/preference.routes';
import { recipeRoutes } from './modules/recipes/recipe.routes';
import { userRoutes } from './modules/users/user.routes';
import authPlugin from './plugins/auth';

const app=  Fastify({
    logger: true,
}).withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);


if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined.');
}
app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
})
app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    sign: {
        expiresIn: '30d'
    }
})
// Middleware (hook) para verificar token
app.register(authPlugin);

app.register(authRoutes, {prefix: '/api/auth'});
app.register(loginRoutes, {prefix: '/api/auth'});
//user
app.register(userRoutes, {prefix: '/api/user'});
// preferences
app.register(preferenceRoutes, {prefix: '/api'});
//ingredients
app.register(ingredientRoutes, {prefix: '/api'});
//Nutrients
app.register(nutrientRoutes, {prefix: '/api'});

//Recipies
app.register(recipeRoutes, {prefix: '/api'});
//plan AI
app.register(planRoutes, {prefix: '/api'})

//families
app.register(familyRoutes, {prefix: '/api'})

console.log(process.env.PORT)
app.listen({ port:Number(process.env.PORT) || 3333,host: '0.0.0.0'})
.then(() => {
    console.log('HTTP server running on http://localhost:3333')
})
.catch(err => {
    console.error(err)
    process.exit(1)
})

app.route({
    method: 'GET',
    url: '/',
    handler: (request, reply) => {
        return 'Hello World'
    }
})  


