import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CommonResponse,
  Response200,
  Response201,
  Response400,
  Response401,
  Response403,
  Response404,
  Response500,
} from './api-response.dto';

@Injectable()
export class ApiOutputInterceptor<T>
  implements NestInterceptor<T, CommonResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CommonResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const status = context.switchToHttp().getResponse().statusCode;

        if (status === 200) {
          const response: Response200<T> = {
            status,
            message: '데이터 로딩에 성공했습니다.',
            data,
          };
          return response;
        } else if (status === 201) {
          const response: Response201<T> = {
            status,
            message: '데이터가 성공적으로 생성되었습니다.',
            data,
          };
          return response;
        } else if (status === 400) {
          const response: Response400<T> = {
            status,
            message: '오류가 발생했습니다.',
            data,
          };
          return response;
        } else if (status === 401) {
          const response: Response401<T> = {
            status,
            message: '인증이 필요합니다.',
            data,
          };
          return response;
        } else if (status === 403) {
          const response: Response403<T> = {
            status,
            message: '권한이 필요합니다.',
            data,
          };
          return response;
        } else if (status === 404) {
          const response: Response404<T> = {
            status,
            message: '요청하신 정보가 존재하지 않습니다.',
            data,
          };
          return response;
        } else if (status === 500) {
          const response: Response500<T> = {
            status,
            message: '서버 오류가 발생했습니다.',
            data,
          };
          return response;
        } else {
          // 이외의 경우는 그냥 그대로 리턴
          return data;
        }
      }),
    );
  }
}
