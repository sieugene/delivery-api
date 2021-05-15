import ProductsSearchBody from './productsSearchBody.interface';

interface ProductsSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: ProductsSearchBody;
    }>;
  };
}
export default ProductsSearchResult;
