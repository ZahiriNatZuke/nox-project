export interface EntityPagination<W, O> {
	skip?: number;
	take?: number;
	where?: W;
	orderBy?: O;
}
