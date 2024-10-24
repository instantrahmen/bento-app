import type { Actions } from './$types';
import { signOut } from '$features/auth/auth';
export const actions: Actions = { default: signOut };
