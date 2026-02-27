export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export class MockUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    // Simula um delay de rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Usuário fake sempre "encontrado" para facilitar navegação
    return {
      id: "1",
      name: "Explorador Galáctico",
      email,
      avatarUrl: "https://github.com/shadcn.png",
    };
  }
}
