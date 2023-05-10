export enum TicketStatus {
    Pending  = 'Pending',
    Accepted = 'Accepted',
    Rejected = 'Rejected',
}

export default interface Ticket
{
    status ?: TicketStatus;
}