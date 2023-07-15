import {redirect} from "primate";
import {assert} from "runtime-compat/dyndef";

export default {
  async get(request) {
    const {target} = request.path.get();
    const {Link} = request.store;
    const links = await Link.find({target});
    assert(links.length === 1);
    const [link] = links;
    return redirect(link.source);
  },
};
