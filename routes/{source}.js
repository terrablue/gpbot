import {redirect} from "primate";
import {assert} from "runtime-compat/invariant";

export default {
  async get(request) {
    const {source} = request.path.get();
    const {Link} = request.store;
    const links = await Link.find({source});
    assert(links.length === 1);
    const [link] = links;
    return redirect(link.target);
  },
};
