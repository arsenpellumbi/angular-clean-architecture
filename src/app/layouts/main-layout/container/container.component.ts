import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuType } from '../core/enums/menu-type.enum';
import { MenuService } from '../core/services/menu.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  home = { icon: 'pi pi-home', routerLink: '/' };
  menuType!: MenuType;
  menuTypeSubscription!: Subscription;

  get isSlimMenu() {
    return this.menuType === MenuType.Slim;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private menuService: MenuService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => (this.items = this.createBreadcrumbs(this.route.root)));
  }

  ngOnInit() {
    this.menuTypeSubscription = this.menuService.menuType.subscribe(
      (menuType) => (this.menuType = menuType)
    );
  }

  ngOnDestroy() {
    this.menuTypeSubscription.unsubscribe();
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    routerLink: string = '',
    breadcrumbs: MenuItem[] = []
  ): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        routerLink += `/${routeURL}`;
      }

      const label = child.snapshot.data.breadcrumb;
      if (!!label) {
        breadcrumbs.push({ label, routerLink });
      }

      return this.createBreadcrumbs(child, routerLink, breadcrumbs);
    }

    return breadcrumbs;
  }
}
