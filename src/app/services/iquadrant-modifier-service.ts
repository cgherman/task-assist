export interface IQuadrantModifierService<T> {
    setQuadrant(item: T, targetQuadrant: string);
    checkQuadrantMatch(item: T, quadrantChar:string);
}