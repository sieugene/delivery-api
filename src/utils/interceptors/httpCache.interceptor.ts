import {
  CacheInterceptor,
  CACHE_KEY_METADATA,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    if (cacheKey) {
      const request = context.switchToHttp().getRequest();
      console.log('Cache found or create?');
      return `${cacheKey}-${request._parsedUrl.query}`;
    }
    console.log('Default method was call');

    return super.trackBy(context);
  }
}
