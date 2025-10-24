declare module "react-js-pagination" {
  import { ComponentType } from 'react';

  interface PaginationProps {
    activePage: number;
    itemsCountPerPage: number;
    totalItemsCount: number;
    pageRangeDisplayed: number;
    onChange: (pageNumber: number) => void;
    [key: string]: unknown;
  }

  const Pagination: ComponentType<PaginationProps>;
  export default Pagination;
}
