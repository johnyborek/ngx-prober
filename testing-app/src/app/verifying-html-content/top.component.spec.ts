import { probeComponent } from '../../../../src/index';
import { TestingModule } from './testing.module';
import { TopComponent } from './top.component';

describe('HtmlContentVerification', () => {
  const probe = probeComponent(TopComponent, TestingModule);

  it('should contain text', () => {
    expect(probe.nativeElement.innerHTML.indexOf('First paragraph')).not.toEqual(-1);
  });

  it('should contain elements matching css selector', () => {
    expect(probe.queryAllByCss('p.odd').length).toEqual(2);
  });

  it('should contain tag with attribute of given value', () => {
    expect(probe.queryByCss('h1').attributes['class']).toEqual('header');
  });

  it('should examine nested nativeElement', () => {
    expect(probe.queryAllByCss('p')[2].nativeElement.innerHTML).toEqual('Third paragraph');
  });
});

