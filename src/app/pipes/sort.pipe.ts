import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(values: any[], path: string, order: number): any[] {
    if (!values) { return null; }
    if (!path || !order) { return values; }

    return values.sort((a: any, b: any) => {
      a = a[path];
      b = b[path];
      return a > b ? order : order * (- 1);
    });
  }
}
