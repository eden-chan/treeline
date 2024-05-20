import { CurriculumNodeWithRelations } from "@src/lib/types";

export const getNodeByid = (
	id: string,
	root: CurriculumNodeWithRelations,
): CurriculumNodeWithRelations | undefined => {
	if (root.id === id) {
		return root;
	}
	if (root.children) {
		for (const child of root.children) {
			const node = getNodeByid(id, child);
			if (node) {
				return node;
			}
		}
	}
	return undefined;
};
