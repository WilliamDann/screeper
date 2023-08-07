import harvest from "./harvest";

// All the roles referenced by their name
//  this is used to go from roleName -> roleFunction()
const all = {
    'harvest': harvest,
}
export default all;