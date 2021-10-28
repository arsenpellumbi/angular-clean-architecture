import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuType } from '../core/enums/menu-type.enum';
import { MenuService } from '../core/services/menu.service';

@Component({
  selector: 'app-static-menu',
  templateUrl: './static-menu.component.html',
  styleUrls: ['./static-menu.component.scss'],
})
export class StaticMenuComponent implements OnInit, OnDestroy {
  menuType!: MenuType;
  menuTypeSubscription!: Subscription;

  get isSlimMenu() {
    return this.menuType === MenuType.Slim;
  }

  items = [
    {
      icon: 'mdi mdi-home',
      label: 'Home',
      routerLink: ['/home'],
    },
    {
      icon: 'mdi mdi-folder',
      label: 'Projects',
      routerLink: ['/projects'],
    },
  ];

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menuTypeSubscription = this.menuService.menuType.subscribe(
      (menuType) => (this.menuType = menuType)
    );
  }

  ngOnDestroy() {
    this.menuTypeSubscription.unsubscribe();
  }

  onToggleMenu() {
    switch (this.menuType) {
      case MenuType.Static:
        this.menuService.changeMenuType(MenuType.Slim);
        return;
      default:
        this.menuService.changeMenuType(MenuType.Static);
        return;
    }
  }
}
