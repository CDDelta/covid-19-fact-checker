import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truthfulness',
  pure: true
})
export class TruthfulnessPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    switch (value) {
      case 'unverified':
        return 'Unverified';
      case 'false':
        return 'False';
      case 'mostly_false':
        return 'Mostly False';
      case 'half_true':
        return 'Half True';
      case 'mostly_true':
        return 'Mostly True';
      case 'true':
        return 'True';
      default:
        return 'Unknown';
    }
  }

}
