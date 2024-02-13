import { redirect } from "primate";
import { assert } from "rcompat/invariant";

export default {
  async get(request) {
    const source = request.path.get("source");
    const { Link } = request.store;
    const links = await Link.find({ source });
    assert(links.length === 1);
    const [link] = links;
    return redirect(link.target);
  },
};
