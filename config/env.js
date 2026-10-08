import { z } from 'zod';

const schema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT:   z.string().default('3000'),
    DATABASE_URL: z.string().url(),
});

const resultat = schema.safeParse(process.env);

if (!resultat.success) {
    console.error('Configuration Invalide: ', resultat.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = resultat.data;