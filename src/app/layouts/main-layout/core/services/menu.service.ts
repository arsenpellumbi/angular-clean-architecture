import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MenuType } from '../enums/menu-type.enum';

@Injectable({ providedIn: 'root' })
export class MenuService {
  public menuType = new BehaviorSubject<MenuType>(MenuType.Static);

  changeMenuType(menuType: MenuType) {
    this.menuType.next(menuType);
  }
}
