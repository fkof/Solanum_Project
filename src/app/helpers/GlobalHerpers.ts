export class GlobalHelpers {
    public formatearFechastr(fechastr: any): string {
        let fecha = new Date(fechastr);

        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear().toString().slice(-2);

        return `${dia}-${mes}-${año}`;
    }

    public formatearFecha(fecha: Date): string {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear().toString().slice(-2);

        return `${dia}-${mes}-${año}`;
    }



    public static isEmpty(value: any): boolean {
        return (
            value === null ||
            value === undefined ||
            (typeof value === 'string' && value.trim().length === 0) ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && Object.keys(value).length === 0)
        );
    }

    public static generateUUID(): string {
        return crypto.randomUUID();
    }
    public getSeverityStatus(estatus: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" {
        switch (estatus) {
            case 'Pendiente':
                return 'warn';
            case 'Autorizada':
                return 'success';
            case 'Rechazada':
                return 'danger';
            case 'Cancelada':
                return 'contrast';
            default:
                return 'info';
        }
    }
}
