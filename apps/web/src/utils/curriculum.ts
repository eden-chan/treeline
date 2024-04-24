import { CurriculumNodeWithRelations } from "@src/lib/types";

export const getNodeById = (
	id: string,
	root: CurriculumNodeWithRelations | undefined | null,
): CurriculumNodeWithRelations | undefined => {
	if (!root) {
		return undefined;
	}

	if (root.id === id) {
		return root;
	}
	if (root.children) {
		for (const child of root.children) {
			const node = getNodeById(id, child);
			if (node) {
				return node;
			}
		}
	}
	return undefined;
};
