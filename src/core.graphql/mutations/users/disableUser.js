/** @flow
 * @briskhome
 * └core.graphql <mutations/users/disableUser.js>
 */

import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql';

import type { CoreContextType } from '../../../utilities/coreTypes';

export default {
  type: new GraphQLObjectType({
    name: 'disableUserPayload',
    fields: {
      result: {
        type: GraphQLBoolean,
      },
    },
  }),
  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: 'disableUserInput',
        fields: {
          username: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
      }),
    },
  },
  resolve: async (obj: Object, args: Object, context: CoreContextType) => {
    const { db } = context;
    const { input: { username } } = args;
    const User = db.model('core:user');
    const user = User.findOne({ _id: username });
    user.isDisabled = true;
    return user.save();
  },
};