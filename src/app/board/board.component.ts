import { Component, OnInit, OnDestroy } from "@angular/core";
import { DragulaService } from "ng2-dragula";
import { Subscription, Observable, of } from "rxjs";
import { flatMap, map, catchError, tap, shareReplay } from "rxjs/operators";

interface Iitem {
    name: string;
    position: number;
}

interface Igroup {
    name: string;
    position: number;
    items: Iitem[];
}

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

    subs = new Subscription();
    COLUMNS = 'COLUMNS';
    ITEMS = 'ITEMS';
    groups: Igroup[];

    readonly dataSource: string = JSON.stringify([
        {
            name: 'Group A',
            position: 0,
            items: [
                {
                    name: 'Item A',
                    position: 0,
                },
                {
                    name: 'Item B',
                    position: 1
                },
                {
                    name: 'Item C',
                    position: 2
                }, {
                    name: 'Item D',
                    position: 3
                }
            ]
        },
        {
            name: 'Group C',
            position: 2,
            items: [
                {
                    name: 'Item c',
                    position: 2
                },
                {
                    name: 'Item a',
                    position: 0
                },
                {
                    name: 'Item b',
                    position: 1
                },                
                {
                    name: 'Item d',
                    position: 3,
                }
            ]
        },
        {
            name: 'Group B',
            position: 1,
            items: [
                {
                    name: 'Item 1',
                    position: 0
                },
                {
                    name: 'Item 2',
                    position: 1
                },
                {
                    name: 'Item 3',
                    position: 2
                },
                {
                    name: 'Item 4',
                    position: 3
                }
            ]
        }
    ]);

    getData(): Observable<Igroup[]> {
        return of(JSON.parse(this.dataSource));
    }

    constructor(private dragulaService: DragulaService) {

        this.dragulaService.createGroup("COLUMNS", {
            direction: 'horizontal',
            moves: (el, source, handle) => handle.className === "group-handle"
        });

        const renumbering = (item: Iitem, newPosition: number, sourceModel: Iitem[], targetModel: Iitem[]) => {
            
            // Renumbering source
            sourceModel.filter(o=>o.name !== item.name).forEach(_item => _item.position = _item.position < item.position ? _item.position : _item.position - 1);

            // Renumbering target
            item.position = newPosition;
            targetModel.filter(o=>o.name !== item.name).forEach(_item => _item.position = _item.position < item.position ? _item.position : _item.position + 1);
        };

        this.subs.add(dragulaService.dropModel<Iitem>(this.COLUMNS)
            .subscribe(({ name, el, target, source, sourceModel, targetModel, item }) => {
                console.log('dropGroups:');
                console.log(item.name);

                let position: number = targetModel.indexOf(item);
                console.log(position);

                renumbering(item, position, sourceModel, targetModel);
            })
        );


        this.subs.add(dragulaService.dropModel<Iitem>(this.ITEMS)
            .subscribe(({ name, el, target, source, sourceModel, targetModel, item }) => {
                console.log('dropModel:');
                console.log(item.name);

                let group: Igroup = this.groups.filter(g => g.items.filter(i => i.name === targetModel.filter(o => o.name !== item.name)[0].name).length > 0)[0];
                console.log(group.name);

                let position: number = targetModel.indexOf(item);
                console.log(position);

                renumbering(item, position, sourceModel, targetModel);
            })
        );
    }

    ngOnInit() {
        this.getData().subscribe(o => this.groups = o);
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    reset() {
        this.getData().subscribe(o => this.groups = o);
    }
}