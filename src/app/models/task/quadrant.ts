export class Quadrant {
    // numeric representation of "unspecified"
    private static UNSELECTED: string = "0";

    // initialize value as unspecified
    private _selection: string = Quadrant.UNSELECTED;

    constructor () {
    }

    // allow values 1-4, otherwise set to unspecified
    set selection(value: string) {
        switch(value) { 
            case "1": { 
                // fall through
            }
            case "2": { 
                // fall through
            }
            case "3": { 
                // fall through
            }
            case "4": { 
                this._selection = value;
            }
            default: { 
                this._selection = Quadrant.UNSELECTED;
               break; 
            }
        }
    }

    // return quadrant value
    get selection(): string{
        return this._selection;
    }
    
    // returns true if a quadrant is not selected
    public isUnselected(): boolean {
        return this._selection == Quadrant.UNSELECTED;
    }

    // generate new Quadrant object with no selection
    public static newQuadrantUnselected(): Quadrant {
        var result: Quadrant = new Quadrant();
        result.setToUnselected();
        return result;
    }

    // generate new Quadrant object with selection as specified
    public static newQuadrant(quadrantChar: string): Quadrant {
        var result: Quadrant = new Quadrant();
        result.setFromChar(quadrantChar);
        return result;
    }

    // set quadrant selection to "unselected"
    public setToUnselected() {
        this._selection = Quadrant.UNSELECTED;
    }

    // set quadrant selection as specified
    public setFromChar(quadrantChar: string) {
        this._selection = quadrantChar;
    }

    // return true if match
    public static isQuadrantMatch(quadrant: Quadrant, quadrantChar: string) {
        return quadrantChar == quadrant.selection;
    }
      
    // map string value to Quadrant enum
    public static quadFromChar(quadrantChar: string): Quadrant {
        return this.newQuadrant(quadrantChar);
    }
}