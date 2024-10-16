import { signOut } from '$features/auth/auth';
import type { Actions } from './$types';
export const actions: Actions = { default: signOut };
