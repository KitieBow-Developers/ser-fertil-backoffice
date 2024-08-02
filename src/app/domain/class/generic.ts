export class Generic {
        /**
 * Que se realiza con el dto persistir, editar, listar
 */
        operacion?: number = 0;
        /**
         * retorna el nuevo objecto clonado
         * @param objeto a clonar
         */
    
        deepCopy(obj: any) {
            let copy: any;
    
            // Handle the 3 simple types, and null or undefined
            if (null == obj || "object" != typeof obj) return obj;
    
            // Handle Date
            if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }
    
            // Handle Array
            if (obj instanceof Array) {
                copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = this.deepCopy(obj[i]);
                }
                return copy;
            }
    
            // Handle Object
            if (obj instanceof Object) {
                if (obj.collection) {
                    return obj;
                }
                copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
                }
                return copy;
            }
    
            throw new Error("Unable to copy obj! Its type isn't supported.");
        }
}
