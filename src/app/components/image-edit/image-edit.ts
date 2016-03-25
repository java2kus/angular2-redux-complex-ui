
import {Component} from 'angular2/core'
import {AppStore} from '../../services/app-store'
import {AppStoreSubscriber, IAppStoreSubscriber} from '../../decorators/app-store-subscriber'
import {changeImageTitle} from '../../actions/image-list-actions'

@Component({
    selector: 'image-edit',
    directives: [],
    templateUrl: 'app/components/image-edit/image-edit.html',
    styleUrls: ['app/components/image-edit/image-edit.css']
})
@AppStoreSubscriber()
export class ImageEdit implements IAppStoreSubscriber {

    public image: any

    constructor(private appStore: AppStore) {
    }

    public onInitAppStoreSubscription(source: any): void {
        return source
            .filter((state: any) => state.imageData.currentImageId)
            .map((state: any) => ({
                details: state.imageData.dataSet[state.imageData.currentImageId],
                url: ['/api', 'images', state.imageData.currentImageId, 'image'].join('/'),
                title: state.imageData.dataSet[state.imageData.currentImageId].title
            }))
            .subscribe((image: any) => this.image = image)
    }

    public updateTitle(newTitle: string) {
        this.appStore.dispatch(changeImageTitle(this.image.details.id, newTitle))
    }
}