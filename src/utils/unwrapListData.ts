/** Backend trả về List hoặc PageResult { content, totalElements, ... } */
export function unwrapListData<T>(data: unknown): T[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data as T[];
  if (typeof data === 'object' && data !== null && 'content' in data) {
    const c = (data as { content: unknown }).content;
    if (Array.isArray(c)) return c as T[];
  }
  return [];
}
