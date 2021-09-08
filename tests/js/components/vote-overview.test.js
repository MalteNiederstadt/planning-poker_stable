import {shallowMount} from '@vue/test-utils';

import Vote from '../../../planning_poker/assets/js/components/Vote.vue';
import VoteOverview from '../../../planning_poker/assets/js/components/VoteOverview.vue';

describe('VoteOverview', () => {
  const participantPermissions = ['planning_poker.vote'];
  const participant1 = {id: 37, name: 'Kevin', permissions: participantPermissions};
  const participant2 = {id: 1, name: 'Manfred', permissions: participantPermissions};
  const participant3 = {id: 30, name: 'Charlotte', permissions: participantPermissions};
  const votes = {
    '1': [participant1],
    '13': [participant2, participant3],
  };
  const partialVotes = {
    '1': [participant1],
    '13': [participant2],
  };

  const consumer = {resetRequested: jest.fn()};

  const wrapper = shallowMount(VoteOverview, {
    propsData: {
      permissions: {
        moderate: false,
      },
    },
    mocks: {
      $t: jest.fn(),
      $consumer: consumer,
    },
  });

  wrapper.vm.participants = [participant1, participant2, participant3];

  describe('renders the elements correctly', () => {
    wrapper.setProps({
      permissions: {
        moderate: true,
      },
    });

    it('no votes', async () => {
      wrapper.vm.votes = {};
      await wrapper.vm.$nextTick();

      expect(wrapper.findAllComponents(Vote)).toHaveLength(0);
      expect(wrapper.findAll('.votes-overview > button').length).toEqual(0);
    });

    it('multiple votes', async () => {
      wrapper.vm.votes = votes;
      await wrapper.vm.$nextTick();

      expect(wrapper.findAllComponents(Vote)).toHaveLength(2);
      expect(wrapper.findAll('.votes-overview .heading-wrapper > button')).toHaveLength(1);
    });
  });

  describe('sets the showVotes flag', () => {
    let testData = [
      {
        'description': 'true if all participants have voted and the user is a voter.',
        'props': {
          'permissions': {
            vote: true,
            moderate: false,
          },
        },
        'votes': votes,
        'expectedResult': true,
      },
      {
        'description': 'false if not all participants have voted and the user is a voter.',
        'props': {
          'permissions': {
            vote: true,
            moderate: false,
          },
        },
        'votes': partialVotes,
        'expectedResult': false,
      },
      {
        'description': 'true if all participants have voted and the user is a voter + moderator.',
        'props': {
          'permissions': {
            vote: true,
            moderate: true,
          },
        },
        'votes': votes,
        'expectedResult': true,
      },
      {
        'description': 'false if not all participants have voted and the user is a voter + moderator.',
        'props': {
          'permissions': {
            vote: true,
            moderate: true,
          },
        },
        'votes': partialVotes,
        'expectedResult': false,
      },
      {
        'description': 'true if all participants have voted and the user is a moderator.',
        'props': {
          'permissions': {
            vote: false,
            moderate: true,
          },
        },
        'votes': votes,
        'expectedResult': true,
      },
      {
        'description': 'true if all participants have voted and the user is a moderator.',
        'props': {
          'permissions': {
            vote: false,
            moderate: true,
          },
        },
        'votes': partialVotes,
        'expectedResult': true,
      },
    ];

    testData.forEach(test => {
      it(test.description, async () => {
        wrapper.vm.votes = test.votes;
        wrapper.setProps(test.props);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.showVotes).toEqual(test.expectedResult);
      });
    });
  });

  it('sorts the results by the amount of votes', () => {
    wrapper.vm.votes = votes;

    expect(wrapper.vm.sortedVotesKeys).toEqual(['13', '1']);
  });

  it('calls the correct reset method on the consumer', () => {
    wrapper.vm.reset();

    expect(wrapper.vm.$consumer.resetRequested.mock.calls).toHaveLength(1);
  });
});
