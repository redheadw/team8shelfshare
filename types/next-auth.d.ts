import "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}


/*que hace el codigo?
le indica a TypeScript que el objeto session.user también contiene: `id: string;`
para poder utilizar: `const session = await auth();
const userId = session?.user?.id;` Sin que TypeScript desconozca esa propiedad
Tambien utilizamos DefaultSession["user"] para conservar las propiedades originales del usuario (name, email e image) y añadir id.
*/
