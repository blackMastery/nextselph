export const GetSelphQuery = `
query ($id: ID!){
  Selph(where:{id: $id}) {
    id
    name
    description
    status
  }
}
`;
