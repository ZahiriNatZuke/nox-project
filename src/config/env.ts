import 'dotenv/config';
import * as process from 'node:process';
import { z } from 'zod';

const envsSchema = z.object({
	ENVIRONMENT: z.string().default('development'),
	PORT: z.coerce.number().default(3000),
	HOST: z.string().default('localhost'),
	ORIGINS: z.string().transform(origins => origins.split(',')),
	RATE_LIMIT_WINDOWS: z.coerce.number(),
	RATE_LIMIT_MAX: z.coerce.number(),
	VERSION: z
		.string()
		.default('1.0.0')
		.transform(() => process.env.npm_package_version || '1.0.0'),
	APP_NAME: z.string(),
	SWAGGER_ADMIN_USERNAME: z.string(),
	SWAGGER_ADMIN_PASSWORD: z.string(),
});

export const env = envsSchema.parse(process.env);
