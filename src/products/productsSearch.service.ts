import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import Products from './products.entity';
import ProductsSearchBody from './types/productsSearchBody.interface';
import ProductsSearchResult from './types/productsSearchResult.interface';

@Injectable()
export default class ProductsSearchService {
  index = 'products';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}
  async indexProduct(product: Products) {
    return this.elasticsearchService.index<
      ProductsSearchResult,
      ProductsSearchBody
    >({
      index: this.index,
      body: {
        id: product.id,
        title: product.title,
        content: product.content,
        authorId: product.authorId,
      },
    });
  }

  async search(text: string) {
    const {
      body,
    } = await this.elasticsearchService.search<ProductsSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'content'],
          },
        },
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async remove(productId: number) {
    await this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: productId,
          },
        },
      },
    });
  }
  async update(product: Products) {
    const newBody: ProductsSearchBody = {
      id: product.id,
      title: product.title,
      content: product.content,
      authorId: product.authorId,
    };
    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');
    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: product.id,
          },
        },
        script: {
          inline: script,
        },
      },
    });
  }
}
