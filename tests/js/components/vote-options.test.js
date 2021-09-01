import {shallowMount} from '@vue/test-utils';

import {createJsonElement} from '../../../planning_poker/assets/js/utils.js';

import VoteOptions from '../../../planning_poker/assets/js/components/VoteOptions.vue';
import PlayingCardButton from '../../../planning_poker/assets/js/components/PlayingCardButton.vue';
import PokerSite from '../../../planning_poker/assets/js/components/PokerSite.vue';

describe('VoteOptions', () => {
  const options = {
    'point_options': [['1', '1'], ['2', '2'], ['3', '3'], ['5', '5']],
    'non_point_options': [['Too large', 'Too large'], ['No idea', 'No idea']],
  };

  const $consumer = {
    submitStoryPoints: jest.fn(),
    submitChoice: jest.fn(),
    app: {
      $refs: {
        storyDetail: {
          setupOverlay: jest.fn(),
        },
      },
    },
  };

  createJsonElement(options, 'options');
  createJsonElement({'moderate': false, 'vote': false}, 'permissions');

  const wrapper = shallowMount(VoteOptions, {
    propsData: {
      permissions: {
        moderate: false,
        userVoted: false,
      },
    },
    mocks: {
      $consumer,
    },
    parentComponent: PokerSite,
  });

  afterEach(() => {
    $consumer.submitChoice.mockClear();
    $consumer.submitStoryPoints.mockClear();
    $consumer.app.$refs.storyDetail.setupOverlay.mockClear();
  });

  describe('displays correct amount of options', () => {
    let testData = [
      {
        'description': `When the user has permissions and hasn't voted before.`,
        'props': {
          'permissions': {
            vote: true,
            moderate: true,
          },
        },
        'numPointOptions': options.point_options.length,
        'numNonPointOptions': options.non_point_options.length,
        'activeStory': 'some story',
      },
      {
        'description': 'When the user has permissions and has voted before.',
        'props': {
          'permissions': {
            vote: true,
            moderate: true,
          },
          'userVoted': true,
        },
        'numPointOptions': options.point_options.length,
        'numNonPointOptions': 0,
        'activeStory': 'some story',
      },
      {
        'description': 'When the user has no permissions.',
        'props': {
          'permissions': {
            vote: false,
            moderate: false,
          },
        },
        'numPointOptions': 0,
        'numNonPointOptions': 0,
        'activeStory': 'some story',
      },
      {
        'description': 'When there is no active story',
        'props': {
          'permissions': {
            vote: true,
            moderate: true,
          },
        },
        'numPointOptions': 0,
        'numNonPointOptions': 0,
        'activeStory': null,
      },
    ];

    testData.forEach(test => {
      it(test.description, async () => {
        wrapper.vm.$parent.$refs.storiesOverview = {'activeStory': test.activeStory};
        wrapper.setProps(test.props);
        await wrapper.vm.$nextTick();
        let playingCardButtons = wrapper.findAllComponents(PlayingCardButton);
        let buttons = wrapper.findAll('.buttons-wrapper button');

        expect(playingCardButtons.length).toEqual(test.numPointOptions);
        expect(buttons.length).toEqual(test.numNonPointOptions);
      });
    });
  });

  it('activates the moderate flag correctly', async () => {
    wrapper.setProps({
      permissions: {
        vote: false,
        moderate: true,
      },
      userVoted: false,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.moderate).toBeTruthy();

    wrapper.setProps({
      permissions: {
        vote: true,
        moderate: true,
      },
      userVoted: true,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.moderate).toBeTruthy();

    wrapper.setProps({
      permissions: {
        vote: true,
        moderate: true,
      },
      userVoted: false,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.moderate).toBeFalsy();

    wrapper.setProps({
      permissions: {
        vote: true,
        moderate: false,
      },
      userVoted: true,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.moderate).toBeFalsy();
  });

  it('vote dispatches to the correct consumer function', async () => {
    wrapper.setProps({
      permissions: {
        moderate: true,
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.vote('choice');
    expect($consumer.submitStoryPoints.mock.calls.length).toEqual(1);
    expect($consumer.submitChoice.mock.calls.length).toEqual(0);

    wrapper.setProps({
      permissions: {
        moderate: false,
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.vote('choice');
    expect($consumer.submitStoryPoints.mock.calls.length).toEqual(1);
    expect($consumer.submitChoice.mock.calls.length).toEqual(1);
  });

  it('removeOption removes the correct option from the lists', () => {
    wrapper.vm.removeOption('3');
    expect(wrapper.vm.choice).toEqual({'point_options': [['3', '3']], index: 2});
    expect(wrapper.vm.options['point_options']).not.toContain(['3', '3']);

    wrapper.vm.resetOptions();

    wrapper.vm.removeOption('Too large');
    expect(wrapper.vm.choice).toEqual({'non_point_options': [['Too large', 'Too large']], index: 0});
    expect(wrapper.vm.options['non_point_options']).not.toContain(['Too large', 'Too large']);
  });

  it('resetOptions puts the choice back in the correct array and in the correct place', () => {
    wrapper.vm.choice = null;
    wrapper.vm.options = options;

    wrapper.vm.removeOption('2');

    wrapper.vm.resetOptions();
    expect(wrapper.vm.choice).toEqual(null);
    expect(wrapper.vm.options['point_options'][1]).toEqual(['2', '2']);
  });


  describe('makeChosen', () => {
    it('calls the correct methods when the user is not a moderator', async () => {
      wrapper.setProps({
        permissions: {
          moderate: false,
        },
      });
      await wrapper.vm.$nextTick();
      wrapper.vm.removeOption('5');
      wrapper.vm.makeChosen({rank: '3'});

      expect(wrapper.vm.options['point_options']).toContainEqual(['5', '5']);
      expect(wrapper.vm.choice).toEqual({'index': 2, 'point_options': [['3', '3']]});
      expect(wrapper.vm.options['point_options']).not.toContain(['3', '3']);
      expect($consumer.app.$refs.storyDetail.setupOverlay.mock.calls[0]).toEqual(['3']);
    });

    it('calls the correct methods when the user is a moderator', async () => {
      wrapper.setProps({
        permissions: {
          moderate: true,
        },
      });
      await wrapper.vm.$nextTick();
      wrapper.vm.resetOptions();
      wrapper.vm.removeOption('Too large');
      wrapper.vm.makeChosen({rank: '3'});

      expect(wrapper.vm.options['non_point_options']).toContainEqual(['Too large', 'Too large']);
      expect(wrapper.vm.choice).toEqual(null);
      expect(wrapper.vm.options['point_options']).toContainEqual(['3', '3']);
      expect($consumer.app.$refs.storyDetail.setupOverlay.mock.calls.length).toEqual(0);
    });

    it('does not reset the option when the user has not casted a vote before', () => {
      wrapper.setProps({
        permissions: {
          moderate: true,
          vote: true,
        },
      });
      wrapper.vm.resetOptions();
      wrapper.vm.choice = null;
      wrapper.vm.resetOptions = jest.fn();
      wrapper.vm.makeChosen({rank: '3'});

      expect(wrapper.vm.resetOptions.mock.calls).toHaveLength(0);
    });
  });
});
