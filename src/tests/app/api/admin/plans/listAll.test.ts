import { describe, it, expect, mock } from "bun:test";

// Mock das actions
mock.module("@/actions/plans", () => ({
  createPlanAction: mock(() => Promise.resolve({ success: true, data: { id: 1 } })),
  deletePlanAction: mock(() => Promise.resolve({ success: true })),
  readAllPlansAction: mock(() => Promise.resolve({ success: true, data: [{ id: 1 }] })),
  readPlanAction: mock(() => Promise.resolve({ success: true, data: { id: 1 } })),
  subscribeToPlanAction: mock(() => Promise.resolve({ success: true })),
  updatePlanAction: mock(() => Promise.resolve({ success: true })),
}));

describe("TDD - Listar Todos os Planos", () => {
  it("deve retornar uma lista de planos com status 200", async () => {
    // Tenta chamar o endpoint que ainda não criamos
    const { GET } = await import("@/app/api/admin/plans/all/route");
    const req = new Request("http://localhost/api/admin/plans/all");

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
  });
});
