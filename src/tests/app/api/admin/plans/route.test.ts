import { describe, it, expect, mock, beforeEach } from "bun:test";
import { GET } from "@/app/api/admin/plans/route";
import * as actions from "@/actions/plans";
import { NextResponse } from "next/server";

// Mock das actions para isolar o teste do endpoint
mock.module("@/actions/plans", () => ({
  readPlanAction: mock(() => { }),
}));

describe("Admin Plans API - GET", () => {
  it("deve retornar 400 se o ID não for fornecido", async () => {
    const req = new Request("http://localhost/api/admin/plans");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("ID is required");
  });

  it("deve retornar 200 e os dados do plano quando o ID for válido", async () => {
    const mockPlan = { id: 1, value: 50, duraction: 30 };

    // Configura o mock da action
    (actions.readPlanAction as any).mockImplementation(() =>
      Promise.resolve({ success: true, data: mockPlan })
    );

    const req = new Request("http://localhost/api/admin/plans?id=1");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockPlan);
  });

  it("deve retornar 404 se o plano não for encontrado", async () => {
    (actions.readPlanAction as any).mockImplementation(() =>
      Promise.resolve({ success: false, error: "Plan not found" })
    );

    const req = new Request("http://localhost/api/admin/plans?id=999");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Plan not found");
  });
});
