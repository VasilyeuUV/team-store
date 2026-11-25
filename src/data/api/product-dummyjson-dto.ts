/** @file DTO товара в форме ответа DummyJSON */

/** DTO товара от DummyJSON API. */
export interface ProductDummyJsonDto {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly price: number;
  readonly thumbnail: string;
  readonly stock?: number;
}
