import { compareItems, rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn, SortingFn, sortingFns } from "@tanstack/react-table";

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
        itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
};

export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
    let dir = 0;

    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(rowA.columnFiltersMeta[columnId]?.itemRank, rowB.columnFiltersMeta[columnId]?.itemRank);
    }

    // Provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export const sortHandler = (direction: boolean | "asc" | "desc"): boolean | undefined => {
    if (direction === "desc") return undefined;
    if (direction === false) return false;
    if (direction === "asc") return true;
};
