
import _ from 'lodash'
import {Component} from '@angular/core'
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router'
import {AppStore} from '../../services/app-store'
import {AppStoreSubscriber, IAppStoreSubscriber} from '../../decorators/app-store-subscriber'
import {isTagIncludedInList, getUniqueTagsList} from '../../utils/tag-utils'

@Component({
    selector: 'image-group-list',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'app/components/image-group-list/image-group-list.html',
    styleUrls: ['app/components/image-group-list/image-group-list.css']
})
@AppStoreSubscriber()
export class ImageGroupList implements IAppStoreSubscriber {

    public imageGroups: any[];

    private isEditRoute: boolean = false;

    constructor(
        private appStore: AppStore,
        private route: ActivatedRoute) {
    }

    public ngOnInit() {
        // this.route.params
        //     .map((params) => params.isEditRoute)
        //     .subscribe((isEditRoute) => {
        //         this.isEditRoute = isEditRoute;
        //     });
    }

    public imageRouteFor(img) {
        return [
            '/images',
            this.isEditRoute ? 'edit' : 'view',
            img.id
        ];
    }

    public onInitAppStoreSubscription(source: any): void {
        return source
            .map((state: any) => state.imageData)
            .subscribe((imageData: any) => {
                this.imageGroups = _(getUniqueTagsList(imageData.dataSet))
                    .filter((tag: string) => !isTagIncludedInList(tag, imageData.excludedTags))
                    .orderBy(tag => tag)
                    .map((tag: string) => ({
                        name: tag,
                        included: _(imageData.displayedItems)
                            .map((id: string) => imageData.dataSet[id])
                            .filter((img: any) => isTagIncludedInList(tag, img.tags))
                            .map((img: any) => ({
                                id: img.id,
                                title: img.title,
                                url: ['api', 'images', img.id, 'thumb'].join('/')
                            }))
                            .value()
                    }))
                    .value()
            })
    }
}
