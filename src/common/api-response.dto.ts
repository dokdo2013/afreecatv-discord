import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export interface CommonResponse<T> {
  status: number;
  message: string;
  data: T;
}

export class Response200<T> implements CommonResponse<T> {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: '데이터 로딩에 성공했습니다.' })
  message: string;

  @ApiProperty()
  data: T;
}

export class Response201<T> implements CommonResponse<T> {
  @ApiProperty({ example: 201 })
  status: number;

  @ApiProperty({ example: '데이터가 성공적으로 생성되었습니다.' })
  message: string;

  @ApiProperty()
  data: T;
}

export class Response400<T> implements CommonResponse<T> {
  @ApiProperty({ example: 400 })
  status: number;

  @ApiProperty({ example: '오류가 발생했습니다.' })
  message: string;

  @ApiProperty()
  data: T;
}

export class Response401<T> implements CommonResponse<T> {
  @ApiProperty({ example: 401 })
  status: number;

  @ApiProperty({ example: '인증이 필요합니다.' })
  message: string;

  @ApiProperty()
  data: T;
}

export class Response403<T> implements CommonResponse<T> {
  @ApiProperty({ example: 403 })
  status: number;

  @ApiProperty({ example: '권한이 필요합니다.' })
  message: string;

  @ApiProperty()
  data: T;
}

export class Response404<T> implements CommonResponse<T> {
  @ApiProperty({ example: 404 })
  status: number;

  @ApiProperty({ example: '요청하신 정보가 존재하지 않습니다.' })
  message: string;

  @ApiProperty()
  data: T;
}

export class Response500<T> implements CommonResponse<T> {
  @ApiProperty({ example: 500 })
  status: number;

  @ApiProperty({ example: '서버 오류가 발생했습니다.' })
  message: string;

  @ApiProperty()
  data: T;
}

interface ApiOptions {
  statusCode: number;
  isArray: boolean;
  nullable: boolean;
}

export function ApiResponseType<T>(
  classRef: Type<T>,
  options?: Partial<ApiOptions>,
): Type<CommonResponse<T>> {
  abstract class ApiResponseTypeClass implements CommonResponse<T> {
    @ApiProperty({ type: Number, default: options?.statusCode ?? 200 })
    status: number;

    @ApiProperty({ type: String, default: '데이터 로딩에 성공했습니다.' })
    message: string;

    @ApiProperty({
      type: classRef,
      isArray: options?.isArray ?? false,
      nullable: options?.nullable ?? false,
    })
    data: T;
  }

  Object.defineProperty(ApiResponseTypeClass, 'name', {
    value: `${classRef.name}${options?.isArray ? 'Array' : ''}Type`,
    writable: false,
  });

  return ApiResponseTypeClass as Type<ApiResponseTypeClass>;
}
