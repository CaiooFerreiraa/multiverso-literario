export type Database = <
  T extends Record<string, any> = Record<string, any>
>(
  strings: TemplateStringsArray,
  ...values: any[]
) => Promise<T[]>;